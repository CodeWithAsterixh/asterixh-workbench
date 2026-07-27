(module
  (memory (import "env" "memory") 64)

  (func $emit
    (param $out i32)
    (param $count i32)
    (param $x1 i32)
    (param $y1 i32)
    (param $x2 i32)
    (param $y2 i32)
    (param $row i32)
    (param $col i32)
    (result i32)
    (local $base i32)
    local.get $out
    local.get $count
    i32.const 24
    i32.mul
    i32.add
    local.tee $base
    local.get $x1
    i32.store
    local.get $base
    i32.const 4
    i32.add
    local.get $y1
    i32.store
    local.get $base
    i32.const 8
    i32.add
    local.get $x2
    i32.store
    local.get $base
    i32.const 12
    i32.add
    local.get $y2
    i32.store
    local.get $base
    i32.const 16
    i32.add
    local.get $row
    i32.store
    local.get $base
    i32.const 20
    i32.add
    local.get $col
    i32.store
    local.get $count
    i32.const 1
    i32.add)

  (func (export "collectBoundaryEdges")
    (param $grid i32)
    (param $rows i32)
    (param $cols i32)
    (param $out i32)
    (result i32)
    (local $r i32)
    (local $c i32)
    (local $rowBase i32)
    (local $idx i32)
    (local $count i32)
    (local $value i32)
    (local $emitCount i32)

    i32.const 0
    local.set $r
    i32.const 0
    local.set $count

    block $rows_done
      loop $rows_loop
        local.get $r
        local.get $rows
        i32.ge_u
        br_if $rows_done

        local.get $r
        local.get $cols
        i32.mul
        local.set $rowBase

        i32.const 0
        local.set $c

        block $cols_done
          loop $cols_loop
            local.get $c
            local.get $cols
            i32.ge_u
            br_if $cols_done

            local.get $rowBase
            local.get $c
            i32.add
            local.set $idx

            local.get $grid
            local.get $idx
            i32.add
            i32.load8_u
            local.set $value

            local.get $value
            i32.eqz
            if
            else
              ;; top edge
              local.get $r
              i32.eqz
              if
                local.get $out
                local.get $count
                i32.const 0
                local.get $c
                local.get $r
                local.get $c
                i32.const 1
                i32.add
                local.get $r
                local.get $r
                local.get $c
                call $emit
                local.set $count
              else
                local.get $grid
                local.get $idx
                local.get $cols
                i32.sub
                i32.add
                i32.load8_u
                i32.eqz
                if
                  local.get $out
                  local.get $count
                  i32.const 0
                  local.get $c
                  local.get $r
                  local.get $c
                  i32.const 1
                  i32.add
                  local.get $r
                  local.get $r
                  local.get $c
                  call $emit
                  local.set $count
                end
              end

              ;; right edge
              local.get $c
              local.get $cols
              i32.const 1
              i32.sub
              i32.eq
              if
                local.get $out
                local.get $count
                local.get $c
                i32.const 1
                i32.add
                local.get $r
                local.get $c
                i32.const 1
                i32.add
                local.get $r
                i32.const 1
                i32.add
                local.get $r
                local.get $c
                call $emit
                local.set $count
              else
                local.get $grid
                local.get $idx
                i32.const 1
                i32.add
                i32.add
                i32.load8_u
                i32.eqz
                if
                  local.get $out
                  local.get $count
                  local.get $c
                  i32.const 1
                  i32.add
                  local.get $r
                  local.get $c
                  i32.const 1
                  i32.add
                  local.get $r
                  i32.const 1
                  i32.add
                  local.get $r
                  local.get $c
                  call $emit
                  local.set $count
                end
              end

              ;; bottom edge
              local.get $r
              local.get $rows
              i32.const 1
              i32.sub
              i32.eq
              if
                local.get $out
                local.get $count
                local.get $c
                i32.const 1
                i32.add
                local.get $r
                i32.const 1
                i32.add
                local.get $c
                local.get $r
                i32.const 1
                i32.add
                local.get $r
                local.get $r
                local.get $c
                call $emit
                local.set $count
              else
                local.get $grid
                local.get $idx
                local.get $cols
                i32.add
                i32.add
                i32.load8_u
                i32.eqz
                if
                  local.get $out
                  local.get $count
                  local.get $c
                  i32.const 1
                  i32.add
                  local.get $r
                  i32.const 1
                  i32.add
                  local.get $c
                  local.get $r
                  i32.const 1
                  i32.add
                  local.get $r
                  local.get $r
                  local.get $c
                  call $emit
                  local.set $count
                end
              end

              ;; left edge
              local.get $c
              i32.eqz
              if
                local.get $out
                local.get $count
                local.get $c
                local.get $r
                i32.const 1
                i32.add
                local.get $c
                local.get $r
                local.get $r
                i32.const 1
                i32.add
                local.get $r
                local.get $c
                call $emit
                local.set $count
              else
                local.get $grid
                local.get $idx
                i32.const 1
                i32.sub
                i32.add
                i32.load8_u
                i32.eqz
                if
                  local.get $out
                  local.get $count
                  local.get $c
                  local.get $r
                  i32.const 1
                  i32.add
                  local.get $c
                  local.get $r
                  local.get $r
                  i32.const 1
                  i32.add
                  local.get $r
                  local.get $c
                  call $emit
                  local.set $count
                end
              end
            end

            local.get $c
            i32.const 1
            i32.add
            local.set $c
            br $cols_loop
          end
        end

        local.get $r
        i32.const 1
        i32.add
        local.set $r
        br $rows_loop
      end
    end

    local.get $count)
